<?php

namespace App\Repositories\Interfaces;

interface SConfigurationRepositoryInterface
{
    public function getConfigurations(string $key);

    public function updateValue(string $key, string $value);
}