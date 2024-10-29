import { Pool } from "pg";

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'your_pg_database',
    password: 'your_pg_password',
    port: 5432,
  });

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
  
export default pool;