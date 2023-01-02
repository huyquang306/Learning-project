<?php

namespace App\Repositories\Interfaces;

interface BaseRepositoryInterface
{
    /**
     * Get all data in a table
     *
     * @return mixed
     */
    public function getAll();

    /**
     * Find a model instance by its ID
     *
     * @param $id
     * @return mixed
     */
    public function find($id);

    /**
     * Find a model instance by its attribute
     *
     * @param string $attribute
     * @param mixed  $value
     * @param bool   $shouldThrowException
     * @return mixed
     */
    public function findBy(string $attribute, $value, bool $shouldThrowException);

    /**
     * Get the first specified model record from the database
     *
     * @return mixed
     */
    public function first();

    /**
     * Find entities by their attribute values
     *
     * @param string $attribute
     * @param array $values
     * @return mixed
     */
    public function whereIn(string $attribute, array $values);

    /**
     * Find data by multiple fields
     *
     * @param string $attribute
     * @param string $condition
     * @param mixed $value
     * @return mixed
     */
    public function where(string $attribute, string $condition, $value);

    /**
     * Insert a row to table
     *
     * @param array $attributes
     * @return mixed
     */
    public function create(array $attributes);

    /**
     * Insert a row to table and retrieve its ID
     *
     * @param array $attributes
     * @return mixed
     */
    public function insertGetId(array $attributes);

    /**
     * Update a row in table
     *
     * @param $id
     * @param array $attributes
     * @return mixed
     */
    public function update($id, array $attributes);

    /**
     * Update or create a model instance
     *
     * @param array $attributes
     * @param array $values
     * @return mixed
     */
    public function updateOrCreate(array $attributes, array $values);

    /**
     * Delete
     *
     * @param $id
     * @return mixed
     */
    public function delete($id);

    /**
     * Insert multiple rows to table
     *
     * @param $data
     * @return mixed
     */
    public function insert($data);

    /**
     * Make unique hash_id for this model
     *
     * @return string
     */
    public function makeHashId(): string;

    /**
     * Count the number of specified model records in the database
     *
     * @return int
     */
    public function count(): int;

    /**
     * Return the query builder order by the specified attribute
     *
     * @param string $attribute
     * @param string $direction
     * @return mixed
     */
    public function orderBy(string $attribute, string $direction);
}
