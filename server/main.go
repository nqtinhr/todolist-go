package main

import (
	"log"
	"net/http"
	"os"
	"strconv"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

type TodoList struct {
	Id       int    `json:"id" gorm:"column:id;"`
	Title    string `json:"title" gorm:"column:title;"`
	Complete bool   `json:"complete" gorm:"column:complete;"`
}

func (TodoList) TableName() string { return "todos" }

type TodoListUpdate struct {
	Title    *string `json:"title" gorm:"column:title;"`
	Complete *bool   `json:"complete" gorm:"column:complete;"`
}

func (TodoListUpdate) TableName() string { return TodoList{}.TableName() }

func main() {
	dsn := os.Getenv("MYSQL_CONN_STRING")
	// dsn := "todolist:abc@123@tcp(127.0.0.1:3306)/todolist?charset=utf8mb4&parseTime=True&loc=Local"
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})

	if err != nil {
		log.Fatalln(err)
	}

	log.Println(db, err)

	// lấy server
	r := gin.Default()

	// Add CORS middleware
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"*"}
	config.AllowMethods = []string{"GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"}
	r.Use(cors.New(config))

	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})

	api := r.Group("api")
	todos := api.Group("/todos")

	todos.POST("", func(c *gin.Context) {
		var data TodoList
		// ShouldBind là bind toàn bộ req
		if err := c.ShouldBind(&data); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})

			return
		}

		db.Create(&data)

		c.JSON(http.StatusOK, data)
	})

	todos.GET("/:id", func(c *gin.Context) {
		id, err := strconv.Atoi(c.Param("id"))

		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})

			return
		}

		var data TodoList

		db.Where("id = ?", id).First(&data)

		c.JSON(http.StatusOK, data)
	})

	todos.GET("", func(c *gin.Context) {
		var data []TodoList

		type Paging struct {
			Page  int `json:"page" from:"page"`
			Limit int `json:"limit" from:"limit"`
		}

		var paging Paging

		if err := c.ShouldBind(&paging); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})

			return
		}

		if paging.Page <= 0 {
			paging.Page = 1
		}

		if paging.Limit <= 0 {
			paging.Limit = 20
		}

		db.Offset((paging.Page - 1) * paging.Limit).Order("id desc").Limit(paging.Limit).Find(&data)

		c.JSON(http.StatusOK, data)
	})

	todos.PATCH("/:id", func(c *gin.Context) {
		id, err := strconv.Atoi(c.Param("id"))

		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
			return
		}

		var existingData TodoList

		if err := db.Where("id = ?", id).First(&existingData).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{
				"error": "Record not found",
			})
			return
		}

		var updateData TodoListUpdate

		if err := c.ShouldBindJSON(&updateData); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
			return
		}

		if updateData.Title != nil {
			existingData.Title = *updateData.Title
		}
		if updateData.Complete != nil {
			existingData.Complete = *updateData.Complete
		}

		if err := db.Save(&existingData).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": err.Error(),
			})
			return
		}

		c.JSON(http.StatusOK, existingData)
	})

	todos.DELETE("/:id", func(c *gin.Context) {
		id, err := strconv.Atoi(c.Param("id"))

		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})

			return
		}

		db.Table(TodoList{}.TableName()).Where("id = ?", id).Delete(nil)

		c.JSON(http.StatusOK, gin.H{
			"data": 1,
		})
	})

	r.Run()
}
