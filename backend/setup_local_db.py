import subprocess
import os
import sys

# Path to psql
PSQL_PATH = r"C:\Program Files\PostgreSQL\18\bin\psql.exe"

def run_psql(command, db="postgres"):
    try:
        # Try without password first (trust mode)
        subprocess.run([PSQL_PATH, "-U", "postgres", "-d", db, "-c", command], check=True)
    except subprocess.CalledProcessError:
        print(f"Failed to run command: {command}")
        return False
    return True

def setup_db():
    print("Setting up local database 'giftforge'...")
    
    # Terminate other sessions and drop if exists
    run_psql("SELECT pg_terminate_backend(pg_stat_activity.pid) FROM pg_stat_activity WHERE pg_stat_activity.datname = 'giftforge' AND pid <> pg_backend_pid();")
    run_psql("DROP DATABASE IF EXISTS giftforge;")
    
    # Create database
    run_psql("CREATE DATABASE giftforge;")
    
    # Create user if not exists (or just grant)
    run_psql("DO $$ BEGIN IF NOT EXISTS (SELECT FROM pg_catalog.pg_user WHERE usename = 'giftadmin') THEN CREATE USER giftadmin WITH PASSWORD 'giftpassword123'; END IF; END $$;")
    run_psql("GRANT ALL PRIVILEGES ON DATABASE giftforge TO giftadmin;")
    run_psql("ALTER DATABASE giftforge OWNER TO giftadmin;")
    
    print("Setup complete! Your 'giftforge' database is now empty and ready.")

if __name__ == "__main__":
    setup_db()
