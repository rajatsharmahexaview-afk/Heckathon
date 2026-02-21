import asyncio
from logging.config import fileConfig
from sqlalchemy import pool
from sqlalchemy.ext.asyncio import async_engine_from_config
from alembic import context
import os
import sys
from dotenv import load_dotenv

# Add the parent directory to sys.path so we can import 'app'
# Assuming alembic is run from the 'backend' folder
sys.path.insert(0, os.path.realpath(os.path.join(os.path.dirname(__file__), '..')))

from app.database import Base
from app.shared.gifts.models import User, Gift, Milestone, Notification, MediaMessage, OverrideWindow

load_dotenv()

config = context.config

# Overwrite sqlalchemy.url from .env
database_url = os.getenv("DATABASE_URL")
if database_url:
    # Alembic needs a sync driver for engine_from_config if not handles specifically,
    # but since we use async_engine_from_config and run_async, we should be fine.
    # However, some alembic commands might expect sqlalchemy.url to be set.
    config.set_main_option("sqlalchemy.url", database_url)

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata

def run_migrations_offline() -> None:
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()

def do_run_migrations(connection):
    context.configure(connection=connection, target_metadata=target_metadata)
    with context.begin_transaction():
        context.run_migrations()

async def run_migrations_online() -> None:
    connectable = async_engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )
    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)
    await connectable.dispose()

if context.is_offline_mode():
    run_migrations_offline()
else:
    asyncio.run(run_migrations_online())
