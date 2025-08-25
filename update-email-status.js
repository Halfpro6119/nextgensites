import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uwpayxbvllrpgvwmfwvw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3cGF5eGJ2bGxycGd2d21md3Z3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzMzUyMjIsImV4cCI6MjA2NzkxMTIyMn0.FM2iGaoOM0w_oevPIba1-ZEKXct16kpO5VuOtKsUd5M';

const supabase = createClient(supabaseUrl, supabaseKey);

const slugsToUpdate = [
  'cwb-property',
  'haart-estate-lettings-walderslade',
  'stanford-grey-estate-agents',
  'inspired-property-hub',
  'martin-co-crawley-lettings-estate-agents',
  'ewemove-walderslade-chatham',
  'simon-miller-company-bearsted',
  'parkinson-real-estate',
  'proffitt-holt-partnership-watford',
  'reeds-rains-estate-agents-wigan',
  'slm-property-estate-agents',
  'to-let-wigan',
  'your-move-estate-agents-watford',
  'marshall-vizard-estate-agents',
  'ftdjohns',
  'swan-property-management',
  'right-room',
  'move-revolution-east-grinstead-crawley',
  'just-mortgages-maidstone',
  'cook-taylor-woodhouse',
  'claytons',
  'dyer-and-hobbis',
  'healy-simpson',
  'hicks-estate-agents',
  'blakemore-and-sons-estate-agents',
  'your-move-estate-agents-walderslade',
  'zoom-estate-agents',
  'hopcroft-property-experts',
  'greenaway-residential-estate-agents',
  'connells-estate-agents-watford',
  'fairfield-estate-agents',
  'shw-stiles-harold-williams',
  'homes-partnership-estate-agents',
  'huntress-recruitment',
  'north-property-solutions',
  'leaders-letting-estate-agents-crawley',
  'the-park-lane-group',
  'your-move-estate-agents-hastings',
  'charles-david-casson-estate-agents',
  'deborah-trott-property',
  'to-let-commercial',
  'the-business-terrace',
  'knights-estate-agents',
  'stuart-reynolds-estate-agent',
  'mansell-mctaggart-estate-agents-crawley',
  'hamptons-estate-agents-horsham',
  'greystones-estate-agents',
  'new-move-estate-agency',
  'vail-williams-crawley',
  'reiss-braniff-personal-estate-agent',
  'patrick-oliver-estate-agency',
  'simon-miller-and-company-maidstone',
  'kingsley-estates',
  'david-george-international-properties',
  'northwood-wigan',
  'fine-and-country-kent',
  'joe-rylett-estate-agent',
  'm-and-w-property-sales-and-lettings',
  'wyatt-hughes',
  'regan-and-hallworth-estate-agents',
  'rolstons-watford-estate-agents',
  'oliver-hart-estate-agents',
  'barratt-homes-the-poppies',
  'meridian-surveyors',
  'john-bray-and-sons-estate-agents',
  'dey-king-and-haria-estate-agents',
  'frederick-and-co-property-services',
  'easy-let-and-sale',
  'mccartney-estate-agents-chelmsford',
  'platt-and-fishwick-solicitors',
  'my-portfolio-estate-agents',
  'rush-witt-wilson',
  'morris-homes-lathom-grange',
  'coles-group',
  'campbells-estate-agents',
  'kba-property',
  'harry-charles-estate-agents',
  'graves-jenkins',
  'adam-toubi-hastings-estate-agent',
  'fazakerley-sharpe',
  'lawns-property',
  'martin-co-chelmsford'
];

async function updateEmailSentStatus() {
  try {
    console.log(`Updating Email Sent status for ${slugsToUpdate.length} contacts...`);
    
    const { data, error } = await supabase
      .from('Outreach')
      .update({ 'Email Sent': true })
      .in('slug', slugsToUpdate);

    if (error) {
      console.error('Error updating records:', error);
      return;
    }

    console.log('Successfully updated Email Sent status to TRUE for all specified contacts');
    console.log('Update completed!');
    
    // Verify the updates
    const { data: verifyData, error: verifyError } = await supabase
      .from('Outreach')
      .select('slug, "Email Sent"')
      .in('slug', slugsToUpdate);
    
    if (verifyError) {
      console.error('Error verifying updates:', verifyError);
      return;
    }
    
    const updatedCount = verifyData?.filter(record => record['Email Sent'] === true).length || 0;
    console.log(`Verification: ${updatedCount} out of ${slugsToUpdate.length} records now have Email Sent = TRUE`);
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the update
updateEmailSentStatus();