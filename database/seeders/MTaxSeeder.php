<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class MTaxSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $countries = MCountry::get();
        if (count($countries)) {
            DB::table('m_tax')->truncate();
            $taxRates = [
                [
                    'name' => 'Standard(10%)',
                    'tax_rate' => 0.1,
                ],
                [
                    'name' => 'Duty-free(0%)',
                    'tax_rate' => 0,
                ],
            ];

            foreach ($countries as $country) {
                foreach ($taxRates as $tax) {
                    MTax::create([
                        'm_country_id' => $country->id,
                        'name' => $tax['name'],
                        'tax_rate' => $tax['tax_rate'],
                    ]);
                }
            }
        } else {
            echo 'Please seed MCountrySeeder first!';
        }
    }
}
