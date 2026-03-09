const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rhrkxuoybkdfdrknckjd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJocmt4dW95YmtkZmRya25ja2pkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTUxMDE5MiwiZXhwIjoyMDg3MDg2MTkyfQ.i2c7VW9uXoaEu9tZyD0k9OESiluK1OEkaGQxX7Z8qaU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function runAudit() {
    console.log('--- Starting Schema Audit ---');

    const { data: pData, error: pError } = await supabase.from('profiles').select('*').limit(1);
    console.log('\n--- Profiles Table ---');
    if (pError) console.log('Error:', pError.message);
    else console.log('Columns:', pData.length > 0 ? Object.keys(pData[0]) : 'Table is empty');

    const { data: bData, error: bError } = await supabase.from('business_profiles').select('*').limit(1);
    console.log('\n--- Business Profiles Table ---');
    if (bError) console.log('Error:', bError.message);
    else console.log('Columns:', bData.length > 0 ? Object.keys(bData[0]) : 'Table is empty');

    console.log('\n--- Storage Buckets ---');
    const { data: buckets, error: bktError } = await supabase.storage.listBuckets();
    if (bktError) console.log('Error fetching buckets:', bktError.message);
    else buckets.forEach(b => console.log('Bucket found:', b.name));

}

runAudit().then(() => process.exit(0));
