conda create --name forecast python=3.10 
conda activate forecast_env 

conda install -c conda-forge eccodes pygrib -y
pip install django django-cors-headers  psycopg2 requests pandas psycopg2 

python manage.py makemigrations
python manage.py migrate 
python manage.py runserver