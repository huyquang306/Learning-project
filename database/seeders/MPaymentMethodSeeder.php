<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\MCountry;
use App\Models\MPaymentMethod;

class MPaymentMethodSeeder extends Seeder
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
            DB::table('m_payment_method')->truncate();
            $paymentMethodNames = [
                'Tiền mặt',
                'Thẻ ngân hàng',
                'Quét QR',
            ];

            foreach ($countries as $country) {
                foreach ($paymentMethodNames as $paymentMethodName) {
                    MPaymentMethod::create([
                        'm_country_id' => $country->id,
                        'name' => $paymentMethodName,
                    ]);
                }

                /*if ($country->code === 'VN') {
                    MPaymentMethod::create([
                        'm_country_id' => $country->id,
                        'name' => $jpNewPaymentMethodName,
                    ]);
                }*/
            }
        } else {
            echo 'Please seed MCountrySeeder first!';
        }
    }
}
