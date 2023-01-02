<?php

namespace App\Repositories;

use App\Repositories\Interfaces\BaseRepositoryInterface;
use Illuminate\Contracts\Container\BindingResolutionException;
use function Symfony\Component\Translation\t;

abstract class BaseRepository implements BaseRepositoryInterface
{
    /**
     * @var \Illuminate\Database\Eloquent\Model
     */
    protected $model;

    /**
     * BaseRepository constructor
     *
     * @throws BindingResolutionException
     */
    public function __construct() {
        $this->setModel();
    }

    /**
     * Set model
     *
     * @return void
     * @throws BindingResolutionException
     */
    public function setModel() {
        $this->model = app()->make(
          $this->getModel()
        );
    }

    /**
     * Get model
     *
     * @return mixed
     */
    abstract public function getModel();

    /**
     * Get all
     *
     * @return \Illuminate\Database\Eloquent\Collection|mixed
     */
    public function getAll()
    {
        return $this->model->all();
    }

    /**
     * Find a model instance by its ID
     *
     * @param $id
     * @return mixed
     */
    public function find($id)
    {
        return $this->model->findOrFail($id);
    }

    /**
     * Find a model instance by its attribute
     *
     * @param string $attribute
     * @param $value
     * @param bool $shouldThrowException
     * @return mixed
     */
    public function findBy(string $attribute, $value, bool $shouldThrowException)
    {
        $query = $this->model->where($attribute, $value);

        return $shouldThrowException ? $query->firstOrFail() :  $query->first();
    }

    /**
     * Get the first specified model record from the database
     *
     * @return mixed
     */
    public function first()
    {
        return $this->model->firstOrFail();
    }

    /**
     * Find entities by their attribute values.
     *
     * @param string $attribute
     * @param array  $values
     * @return mixed
     */
    public function whereIn(string $attribute, array $values)
    {
        return $this->model->whereIn($attribute, $values);
    }

    /**
     * Find entities by their attribute values.
     *
     * @param string $attribute
     * @param string $condition
     * @param $value
     * @return mixed
     */
    public function where(string $attribute, string $condition, $value)
    {
        return $this->model->where($attribute, $condition, $value);
    }

    /**
     * Create
     *
     * @param array $attributes
     * @return mixed
     */
    public function create(array $attributes)
    {
        return $this->model->create($attributes);
    }

    /**
     * Update
     *
     * @param $id
     * @param array $attributes
     * @return mixed
     */
    public function update($id, array $attributes)
    {
        $result = $this->find($id);
        if ($result) {
            $result->update($attributes);

            return $result;
        }

        return false;
    }

    /**
     * Update or Create a model in repository
     *
     * @param array $attributes
     * @param array $values
     * @return mixed
     */
    public function updateOrCreate(array $attributes, array $values)
    {
        return $this->model->updateOrCreate($attributes, $values);
    }

    /**
     * Delete
     *
     * @param $id
     * @return bool
     */
    public function delete($id): bool
    {
        $result = $this->find($id);
        if ($result) {
            $result->delete();

            return true;
        }

        return false;
    }

    /**
     * Insert
     *
     * @param $data
     * @return mixed
     */
    public function insert($data)
    {
        return $this->model->insert($data);
    }

    /**
     * Count the number of specified model records in the database
     *
     * @return int
     */
    public function count(): int
    {
        return $this->model->count();
    }

    /**
     * Return the query builder order by the specified attribute
     *
     * @param string $attribute
     * @param string $direction
     * @return mixed
     */
    public function orderBy(string $attribute, string $direction)
    {
        return $this->model->orderBy($attribute, $direction);
    }

    /**
     * Check if duplicate field value
     *
     * @param $fieldName
     * @param $value
     * @return bool
     */
    public function isExist($fieldName, $value): bool
    {
        return $this->model->where($fieldName, $value)->exists();
    }

    public function makeHashId(): string
    {
        while (true) {
            $hashId = makeHash();
            if (!$this->isExist('hash_id', $hashId)) {
                break;
            }
        }

        return $hashId;
    }
}
