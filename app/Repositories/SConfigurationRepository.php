<?php

namespace App\Repositories;

use App\Models\SConfiguration;
use App\Repositories\Interfaces\SConfigurationRepositoryInterface;
use stdClass;

class SConfigurationRepository extends BaseRepository implements SConfigurationRepositoryInterface
{
    protected $sConfigurationRepository;


    public function getModel(): string
    {
        return SConfiguration::class;
    }

    /**
     * @param string|null $key
     * @return stdClass
     */
    public function getConfigurations(string $key = null): stdClass
    {
        $configurations = $this->model;
        if ($key) {
            $configurations = $configurations->where('key', $key);
        }
        $configurations = $configurations->get();
        $configurationObject = new stdClass();
        foreach ($configurations as $configuration) {
            $configurationObject->{$configuration->key} = $configuration->value;
        }

        // Replace default value if not exists
        if (!property_exists($configurationObject, SConfiguration::ROBOT_REGISTER_KEY)) {
            $configurationObject->{SConfiguration::ROBOT_REGISTER_KEY} = SConfiguration::ROBOT_REGISTER_FALSE;
        }

        return $configurationObject;
    }

    public function updateValue(string $key, string $value)
    {
        return $this->model->updateOrCreate([
            'key' => $key,
        ], [
            'key' => $key,
            'value' => $value,
        ]);
    }
}