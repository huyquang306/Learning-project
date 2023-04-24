<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Artisan;

class CreateMTableDefault extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('m_table_default', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('code');
            $table->timestamps();
        });

        Artisan::call('db:seed', [
            '--class' => 'MTableDefaultSeeder',
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
        Schema::dropIfExists('m_table_default');
    }
}
