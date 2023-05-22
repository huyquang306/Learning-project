<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddTaxValueAndMTaxIdToMMenuTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('m_menu', function (Blueprint $table) {
            $table->decimal('tax_value', 10, 4)
                ->default(0)
                ->after('price');
            $table->unsignedBigInteger('m_tax_id')
                ->nullable(false)
                ->after('tax_value');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('m_menu', function (Blueprint $table) {
            $table->dropColumn('tax_value');
            $table->dropColumn('m_tax_id');

        });
    }
}
