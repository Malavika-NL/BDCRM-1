import os, psycopg
for name, db in [('salespie', os.getenv('SALESPIE_DATABASE_NAME', 'salespie')), ('marketing', os.getenv('MARKETING_DATABASE_NAME', 'email_campaign'))]:
    try:
        conn = psycopg.connect(host=os.getenv('DATABASE_HOST','127.0.0.1'), port=int(os.getenv('DATABASE_PORT','5433')), dbname=db, user=os.getenv('DATABASE_USER','postgres'), password=os.getenv('DATABASE_PASSWORD','Mbits123#@'))
        with conn.cursor() as c:
            table = 'sales_marketingcrmcontact' if name == 'salespie' else 'email_campaign_contact'
            c.execute(f'SELECT COUNT(*) FROM {table}')
            total = c.fetchone()[0]
            c.execute(f'SELECT * FROM {table} ORDER BY 1 DESC LIMIT 3')
            rows = c.fetchall()
            print(name, 'db=', db, 'total=', total)
            print(rows)
        conn.close()
    except Exception as e:
        print(name, 'ERROR', e)
