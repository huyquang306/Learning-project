<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMShop extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('m_shop', function (Blueprint $table) {
            $table->bigIncrements('id')->comment('Primary key');
            $table->string('hash_id', 128)->nullable(true)->comment('Hash ID');
            $table->string('name', 30)->comment('Shop name');
            $table->string('postal_code', 10)
                ->nullable(true)
                ->comment('Postal Code');
            $table->string('prefecture', 50)
                ->nullable(true)
                ->comment('Prefecture name');
            $table->string('city', 50)->nullable(true)->comment('City name');
            $table->string('address', 200)->nullable(true)->comment('Shop address');
            $table->string('building', 100)->nullable(true)->comment('Detail address');
            $table->string('phone_number', 15)->nullable(true)->comment('Phone number');
            $table->string('fax_number', 15)->nullable(true)->comment('Fax number');
            $table->string('email', 255)->nullable(true)->comment('Email address');
            $table->double('lat')->nullable(true)->comment('Latitude');
            $table->double('lon')->nullable(true)->comment('Longitude');
            $table->boolean('opened')
                ->default(true)
                ->comment('Shop opening status');
            $table->date('open_date')->nullable(true)->comment('Open date');
            $table->date('close_date')->nullable(true)->comment('Close date');
            $table->time('start_time')
                ->nullable(true)
                ->comment('Start time : Normal business hours');
            $table->time('end_time')
                ->nullable(true)
                ->comment('End time : Normal business hours such as dinner');
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')
                ->default(DB::raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
            $table->softDeletes();
            $table->unsignedBigInteger('modified_by')
                ->nullable(true)
                ->comment('Last Modified By: Saves the s_account.id of the last modified person');
            $table->unique('hash_id');
        });
        DB::statement("ALTER TABLE `m_shop` comment 'Shop master data'");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('m_shop');
    }
}
