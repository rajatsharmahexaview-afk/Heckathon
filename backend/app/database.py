from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv

load_dotenv()

import ssl

DATABASE_URL = os.getenv("DATABASE_URL")
CA_CERT_PATH = os.getenv("CA_CERT_PATH", "ca.pem")

# SSL Configuration for asyncpg
connect_args = {}
is_local = "localhost" in DATABASE_URL or "127.0.0.1" in DATABASE_URL

if "postgresql" in DATABASE_URL:
    if is_local:
        # Local DB usually doesn't need SSL
        connect_args["ssl"] = False
    elif os.path.exists(CA_CERT_PATH):
        ctx = ssl.create_default_context(cafile=CA_CERT_PATH)
        ctx.verify_mode = ssl.CERT_REQUIRED
        connect_args["ssl"] = ctx
    else:
        # Default for cloud like Aiven
        connect_args["ssl"] = "require"

engine = create_async_engine(
    DATABASE_URL, 
    echo=True, 
    connect_args=connect_args
)

AsyncSessionLocal = sessionmaker(
    engine, 
    class_=AsyncSession, 
    expire_on_commit=False
)

Base = declarative_base()

async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
