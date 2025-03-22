from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, timedelta
from jose import jwt
from passlib.context import CryptContext
from pymongo import MongoClient
from fastapi.concurrency import run_in_threadpool
from bson import ObjectId
from agents.job_scraper import JobScraperAgent
from agents.job_parser import JobParserAgent
from dotenv import load_dotenv
 
load_dotenv()
SECRET_KEY = "c70b46e7d4cb1c3ddfbfc56898b8327d90f1d0c4aaeb97bb038ef3db2a46d19c" 
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 300
MONGO_DB_URL = "mongodb://localhost:27017"
MONGO_DB_NAME = "JobGenie" 

client = MongoClient(MONGO_DB_URL)
db = client[MONGO_DB_NAME]

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

app = FastAPI(title="Auth API with JSON Storage")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"], 
)

#
#
#
#
#

users = db["users"]

class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class User(BaseModel):
    id: str
    username: str
    email: str

class UserInDB(User):
    hashed_password: str

class Token(BaseModel):
    access_token: str
    user_id: str

class TokenData(BaseModel):
    username: Optional[str] = None

class EmailPasswordRequestForm(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: str
    username: str
    email: str

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

async def authenticate_user(email: str, password: str):
    user = await run_in_threadpool(users.find_one, {"email": email})
    
    if not user:
        return None
    
    if not verify_password(password, user["hashed_password"]):
        return None
    
    return user

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@app.post("/auth/signup", response_model=Token)
async def register(user: UserCreate):
    existing_user = await run_in_threadpool(users.find_one, {"email": user.email})
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    hashed_password = get_password_hash(user.password)
    user_data = {
        "username": user.username,
        "email": user.email,
        "hashed_password": hashed_password,
        "companies": []
    }
    
    response = await run_in_threadpool(users.insert_one, user_data)
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )

    return {"access_token": access_token, "user_id": str(response.inserted_id)}

@app.post("/auth/signin", response_model=Token)
async def login_for_access_token(form_data: EmailPasswordRequestForm):
    user = await authenticate_user(form_data.email, form_data.password)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["email"]}, expires_delta=access_token_expires
    )

    return {"access_token": access_token, "user_id": str(user["_id"])}

#
#
#
#
#

companies = db["companies"]

class CompanyCreate(BaseModel):
    name: str
    url: str

class CompanyResponse(BaseModel):
    success: bool

class CompaniesResponse(BaseModel):
    id: str
    name: str
    url: str

class SaveCompanies(BaseModel):
    user_id: str
    companies: List[str]

class SaveCompanyResponse(BaseModel):
    success: bool

class UserCompanies(BaseModel):
    user_id: str

class UserCompaniesReturn(BaseModel):
    id: str
    name: str
    url: str

@app.post("/companies/add", response_model=CompanyResponse)
async def add_company(company: CompanyCreate):
    try:
        company_data = {
            "name": company.name,
            "url": company.url
        }

        await run_in_threadpool(companies.insert_one, company_data)
        
        return {
            "success": True
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while adding the company",
        )
    
@app.get("/companies", response_model=List[CompaniesResponse])
async def get_all_companies():
    try:
        companies_list = await run_in_threadpool(companies.find)
        
        return [
            {
                "id": str(company["_id"]),
                "name": company["name"],
                "url": company["url"],
            }
            for company in companies_list
        ]
    except Exception as e:
        print(f"Error fetching companies: {e}")
        
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while fetching companies",
        )
    
@app.post("/companies/save", response_model=SaveCompanyResponse)
async def save_companies(saveCompanies: SaveCompanies):
    try:
        user_id = ObjectId(saveCompanies.user_id)
        user = await run_in_threadpool(users.find_one, {"_id": user_id})
 
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )
        
        await run_in_threadpool(
            users.update_one,
            {"_id": user_id},
            {"$set": {"companies": saveCompanies.companies}},
        )

        return {
            "success": True
        }
    except Exception as e:
        print(f"Error saving companies: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while saving companies",
        )

@app.post("/user/companies", response_model=List[UserCompaniesReturn])
async def get_all_companies(user: UserCompanies):
    try:
        user_id = ObjectId(user.user_id)
        user_data = await run_in_threadpool(users.find_one, {"_id": user_id})

        if not user_data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )
        
        company_ids = user_data.get("companies", [])
        
        if company_ids:
            company_objects = await run_in_threadpool(
                companies.find,   
                {"_id": {"$in": [ObjectId(cid) for cid in company_ids]}}
            )

            return [
                {
                    "id": str(company["_id"]),
                    "name": company["name"],
                    "url": company["url"],
                }
                for company in company_objects
            ]
    except Exception as e:
        print(f"Error fetching companies: {e}")
        
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while fetching companies",
        )
    
#
#
#
#
#

class JobRequest(BaseModel):
    url: str
    job_titles: List[str]

class CompanyResponse(BaseModel):
    jobs: List[dict]

@app.post("/jobs", response_model=CompanyResponse)
async def add_jobs(job_request: JobRequest):
    try:
        # scraper = JobScraperAgent()
        # raw_data = scraper.execute(job_request.url)

        # parser = JobParserAgent()
        # structured_jobs = parser.execute([raw_data])

        return {
            "jobs": structured_jobs
        }
    except Exception as e:
        print(f"Error inserting job: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while inserting job listing"
        )