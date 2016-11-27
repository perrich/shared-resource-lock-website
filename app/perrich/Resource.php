<?php 
namespace Perrich;

class Resource implements \JsonSerializable
{
    private static $nextId = 1;

    /**
	 * The id
	 *
     * @return int
     */
    public $id;

    /**
	 * The type
	 *
     * @return string
     */
    public $type;

    /**
	 * The resource name
	 *
     * @return string
     */
    public $name;

    /**
	 * The user which hold the resource
	 *
     * @return string
     */
    public $user;
    
    /**
	 * The descriptiob
	 *
     * @return string
     */
    public $description;

    /**
	 * The comment
	 *
     * @return string
     */
    public $comment;
	
    /**
	 * The date of resource begin hold
	 *
     * @return DateTime
     */
    public $date;
	
	public function __construct() {
        $this->id = self::$nextId++; // always define an id (in fact it will be used only once)
	}
	
	public function init($val) {
        if (isset($val->id)) {
		    $this->id = $val->id;
        } 
		$this->type = $val->type;
		$this->name = $val->name;
		$this->user = $val->user;
        if (isset($val->comment)) {
		    $this->comment = $val->comment;
        }
        if (isset($val->description)) {
		    $this->description = $val->description;
        }
		$this->date = isset($val->date) ? \DateTime::createFromFormat(\DateTime::ISO8601, $val->date) : null;
    }
	
	public function jsonSerialize() {
        return [
            'id' => $this->id,
            'type' => $this->type,
			'name' => $this->name,
			'user' => $this->user,
			'description' => $this->description,
			'comment' => $this->comment,
            'date' => isset($this->date) ? $this->date->format(\DateTime::ISO8601) : null
        ];
    }
}