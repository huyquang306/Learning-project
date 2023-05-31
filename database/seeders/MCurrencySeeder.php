<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use App\Models\MCurrency;
use App\Models\MCountry;

class MCurrencySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('m_currency')->truncate();
        $currencies = json_decode(File::get('database/data/currencies.json'));
        $countries = MCountry::get();
        if (count($countries)) {
            DB::table('m_currency')->truncate();

            foreach ($currencies as $currency) {
                $data = collect($currency)->toArray();
                $country = $countries->first(function ($country) use ($data) {
                    return strtolower($country->english_name) === strtolower($data['country_english_name']);
                });
                if ($country) {
                    $data['m_country_id'] = $country->id;
                    unset($data['country_english_name']);

                    MCurrency::create($data);
                }
            }
        } else {
            echo 'Please seed MCountrySeeder first!';
        }
    }
}
