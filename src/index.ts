import { Client } from '@neondatabase/serverless';

export default {
  async fetch(request: Request, env: any): Promise<Response> {
    const client = new Client(env.DATABASE_URL);
    const headers = { 
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json" 
    };

    try {
      await client.connect();
      const res = await client.query('SELECT NOW()');
      return new Response(JSON.stringify({ 
        status: "Dobeha API Online", 
        db_time: res.rows[0].now 
      }), { headers });
    } catch (e: any) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500, headers });
    } finally {
      await client.end();
    }
  }
}
