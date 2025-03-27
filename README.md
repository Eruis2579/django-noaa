# django-noaa
React(with vite)+Django

# Please install Anaconda
    You need to set environmental variables.

# Please install conda env
    conda create --name forecast python=3.10 
    conda activate forecast_env 
# Please install packages
    conda install -c conda-forge eccodes pygrib -y
    pip install django django-cors-headers  psycopg2 requests pandas psycopg2 
# Please migrate
    python manage.py makemigrations
    python manage.py migrate 

# Ok!!! Please Start
    Please run 'weather_forecast/run.bat'
    Please run 'weather_frontend/run.bat'