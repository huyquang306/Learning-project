<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMStaff extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('m_staff', function (Blueprint $table) {
            $table->bigIncrements('id')->comment('Primary key');
            $table->unsignedBigInteger('m_position_id')
                ->nullable(true)
                ->comment('Relation reference to m_position');
            $table->string('family_name', 30)
                ->nullable(true)
                ->comment('Family name');
            $table->string('given_name', 30)
                ->nullable(true)
                ->comment('Given name (First name)');
            $table->string('phone_number', 15)
                ->nullable(true)
                ->comment('Phone number');
            $table->date('birth_date')
                ->nullable(true)
                ->comment('Birth date');
            $table->string('prefecture', 5)
                ->nullable(true)
                ->comment('Prefecture');
            $table->string('city', 50)
                ->nullable(true)
                ->comment('City name');
            $table->string('address', 200)
                ->nullable(true)
                ->comment('Address');
            $table->string('building', 100)
                ->nullable(true)
                ->comment('Detail address');
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')
                ->default(DB::raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
            $table->softDeletes();
            $table->unsignedBigInteger('modified_by')
                ->nullable(true)
                ->comment('Last Modified By: Saves the s_account.id of the last modified person');
            $table->foreign('m_position_id')
                ->references('id')
                ->on('m_position');
            $table->index(['m_position_id']);
        });
        DB::statement("ALTER TABLE `m_staff` comment 'Staff master data'");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('m_staff');
    }
}
