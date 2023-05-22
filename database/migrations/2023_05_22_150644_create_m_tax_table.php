<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Artisan;

class CreateMTaxTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('m_tax', function (Blueprint $table) {
            Schema::create('m_tax', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->unsignedBigInteger('m_country_id')->nullable(false);
                $table->string('name');
                $table->decimal('tax_rate', 10, 4)->default(0);
                $table->timestamps();
            });

            Artisan::call('db:seed', [
                '--class' => 'MTaxSeeder',
                '--force' => true,
            ]);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('m_tax');
    }
}
