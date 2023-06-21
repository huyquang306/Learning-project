<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Artisan;

class CreateMPaymentMethodTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('m_payment_method', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('m_country_id')->nullable(false);
            $table->string('name');
            $table->timestamps();
        });

        Artisan::call('db:seed', [
            '--class' => 'MPaymentMethodSeeder',
            '--force' => true,
        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('m_payment_method');
    }
}
