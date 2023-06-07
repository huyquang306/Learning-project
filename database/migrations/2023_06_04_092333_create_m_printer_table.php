<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMPrinterTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('m_printer', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('m_shop_id')
                ->nullable(false)
                ->default(0);
            $table->string('hash_id', 16)
                ->nullable();
            $table->string('name', 40)
                ->nullable();
            $table->string('model', 20)
                ->nullable();
            $table->string('address', 20)
                ->nullable();
            $table->string('ip', 20)
                ->nullable();
            $table->unsignedBigInteger('m_printer_status_id')
                ->nullable();
            $table->integer('last_poll')
                ->nullable();
            $table->integer('printing')
                ->nullable();
            $table->integer('width')
                ->nullable();
            $table->text('version')
                ->nullable();
            $table->text('status_code')
                ->nullable();
            $table->string('position')
                ->nullable();
            $table->unsignedBigInteger('modified_by')
                ->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('m_shop_id')
                ->references('id')
                ->on('m_shop');
            $table->foreign('m_printer_status_id')
                ->references('id')
                ->on('m_code');
            $table->index('m_shop_id');
            $table->unique('hash_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('m_printer');
    }
}
