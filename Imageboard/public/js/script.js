(function() {
    // COMPONENT------------------------------------//
    Vue.component("popupwindow", {
        template: "#component",
        props: ["imageId", "user"],
        data: function() {
            return {
                imageInfo: {},
                comments: [],
                form: {
                    name: "",
                    comment: ""
                }
            };
        },
        mounted: function() {
            var self = this;
            axios
                .get("/get-image-info/" + this.imageId)
                .then(function(resp) {
                    self.imageInfo = resp.data[0];
                })
                .then(function() {
                    console.log(self.imageInfo);
                });

            axios.get("/get-comment-info/" + this.imageId).then(function(resp) {
                self.comments = resp.data;
            });
            this.form.name = this.user;
            setInterval(
                function() {
                    axios
                        .get("/get-comment-info/" + this.imageId)
                        .then(function(resp) {
                            self.comments = resp.data;
                        });
                }.bind(this),
                2000
            );
        },
        methods: {
            uploadcomment: function() {
                var self = this;
                axios
                    .post("/uploadcomment", {
                        name: self.form.name,
                        comment: self.form.comment,
                        imageId: self.imageId
                    })
                    .then(function(resp) {
                        self.comments.unshift(resp.data);
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
            closepopup: function() {
                this.$emit("closepopup");
            }
        },
        watch: {
            imageId: function() {
                var self = this;
                axios
                    .get("/get-image-info/" + this.imageId)
                    .then(function(resp) {
                        if (resp.data[0]) {
                            self.imageInfo = resp.data[0];
                        } else {
                            location.hash = "";
                        }
                    });

                axios
                    .get("/get-comment-info/" + this.imageId)
                    .then(function(resp) {
                        self.comments = resp.data;
                    });
            }
        }
    });
    // COMPONENT------------------------------------//
    // LOGIN PAGE-----------------------------------//
    new Vue({
        el: "#login",
        data: {
            imageId: location.hash.slice(1),
            images: [],
            buttonVis: true,
            imageUploader: "",
            messageVis: false,
            maxImagesOnPage: 18,
            form: {
                email: "",
                password: ""
            }
        },
        mounted: function() {
            var self = this;
            axios
                .post("/images", {
                    max: this.maxImagesOnPage
                })
                .then(function(resp) {
                    self.images = resp.data;
                });

            setInterval(
                function() {
                    axios
                        .post("/images", {
                            max: this.maxImagesOnPage
                        })
                        .then(function(resp) {
                            console.log(resp.data);
                            if (resp.data[0].id > self.images[0].id) {
                                self.messageVis = true;
                                self.imageUploader = resp.data[0].name;
                                setTimeout(function() {
                                    self.messageVis = false;
                                }, 5000);
                            }
                            self.images = resp.data;
                        });
                }.bind(this),
                3000
            );

            addEventListener("hashchange", function() {
                self.imageId = location.hash.slice(1);
            });
        },
        methods: {
            handleFileChange: function(e) {
                this.form.file = e.target.files[0];
            },
            toggleImage: function(imageId) {
                location.hash = "";
                this.imageId = imageId;
            },
            getMoreImages: function() {
                this.maxImagesOnPage += 6;
                var self = this;
                new Promise(function(res) {
                    let arr = [];
                    for (var i = 0; i < self.images.length; i++) {
                        arr.push(self.images[i].id);
                    }
                    let minId = Math.min(...arr);
                    if (minId) {
                        res(minId);
                    }
                })
                    .then(function(val) {
                        axios
                            .post("/getmore", {
                                minId: val
                            })
                            .then(function(resp) {
                                let newImages = resp.data.rows;
                                for (var i = 0; i < newImages.length; i++) {
                                    self.images.push(newImages[i]);
                                }
                                if (newImages.length < 6) {
                                    self.buttonVis = false;
                                }
                            });
                    })
                    .catch(function(e) {
                        console.log(e);
                    });
            }
        },
        watch: {
            imageId: function() {
                var self = this;
                axios
                    .get("/get-image-info/" + this.imageId)
                    .then(function(resp) {
                        if (resp.data[0]) {
                            self.imageInfo = resp.data[0];
                        } else {
                            location.hash = "";
                        }
                    });

                axios
                    .get("/get-comment-info/" + this.imageId)
                    .then(function(resp) {
                        self.comments = resp.data;
                    });
            }
        }
    });
    // LOGIN PAGE-----------------------------------//
    // PROFILE PAGE-----------------------------------//
    new Vue({
        el: "#profile",
        data: {
            imageId: location.hash.slice(1),
            images: [],
            buttonVis: true,
            maxImagesOnPage: 18,
            user: "",
            form: {
                title: "",
                description: "",
                file: null
            }
        },
        mounted: function() {
            var self = this;
            axios.get("/profile/images").then(function(resp) {
                self.images = resp.data.images;
                self.user = resp.data.user;
            });

            setInterval(
                function() {
                    axios.get("/profile/images").then(function(resp) {
                        self.images = resp.data.images;
                        self.user = resp.data.user;
                    });
                }.bind(this),
                2000
            );

            addEventListener("hashchange", function() {
                self.imageId = location.hash.slice(1);
            });
        },
        methods: {
            handleFileChange: function(e) {
                this.form.file = e.target.files[0];
            },
            uploadFile: function() {
                var formData = new FormData();
                formData.append("file", this.form.file);
                formData.append("title", this.form.title);
                formData.append("description", this.form.description);
                formData.append("username", this.form.username);
                var self = this;
                axios.post("/upload", formData).then(function(resp) {
                    self.images.unshift({
                        title: resp.data.title,
                        url: resp.data.url
                    });
                });
            },
            deleteImage: function(e) {
                var self = this;
                let innerHTML = e.path[2].innerHTML;
                let initiaCropPoint = innerHTML.indexOf("http");
                let lastCropPoint = innerHTML.indexOf("class") - 2;
                let imageUrl = innerHTML.slice(initiaCropPoint, lastCropPoint);
                axios
                    .post("/deletion", {
                        url: imageUrl
                    })
                    .then(function(res) {
                        self.images = res.data;
                    })
                    .catch(function(error) {
                        console.log(error);
                    });
            },
            toggleImage: function(imageId) {
                location.hash = "";
                this.imageId = imageId;
            },
            watch: {
                imageId: function() {
                    var self = this;
                    axios
                        .get("/get-image-info/" + this.imageId)
                        .then(function(resp) {
                            if (resp.data[0]) {
                                self.imageInfo = resp.data[0];
                            } else {
                                location.hash = "";
                            }
                        });

                    axios
                        .get("/get-comment-info/" + this.imageId)
                        .then(function(resp) {
                            self.comments = resp.data;
                        });
                }
            }
        }
    });
    // PROFILE PAGE-----------------------------------//
    // REGISTRATION PAGE-----------------------------------//
    new Vue({
        el: "#registration",
        data: {
            imageId: location.hash.slice(1),
            images: [],
            buttonVis: true,
            imageUploader: "",
            messageVis: false,
            maxImagesOnPage: 18,
            form: {
                name: "",
                email: "",
                password: null
            }
        },
        mounted: function() {
            var self = this;
            axios
                .post("/images", {
                    max: this.maxImagesOnPage
                })
                .then(function(resp) {
                    self.images = resp.data;
                });

            setInterval(
                function() {
                    axios
                        .post("/images", {
                            max: this.maxImagesOnPage
                        })
                        .then(function(resp) {
                            console.log(resp.data);
                            if (resp.data[0].id > self.images[0].id) {
                                self.messageVis = true;
                                self.imageUploader = resp.data[0].name;
                                setTimeout(function() {
                                    self.messageVis = false;
                                }, 5000);
                            }
                            self.images = resp.data;
                        });
                }.bind(this),
                3000
            );

            addEventListener("hashchange", function() {
                self.imageId = location.hash.slice(1);
            });
        },
        methods: {
            handleFileChange: function(e) {
                this.form.file = e.target.files[0];
            },
            toggleImage: function(imageId) {
                location.hash = "";
                this.imageId = imageId;
            },
            getMoreImages: function() {
                this.maxImagesOnPage += 6;
                var self = this;
                new Promise(function(res) {
                    let arr = [];
                    for (var i = 0; i < self.images.length; i++) {
                        arr.push(self.images[i].id);
                    }
                    let minId = Math.min(...arr);
                    if (minId) {
                        res(minId);
                    }
                })
                    .then(function(val) {
                        axios
                            .post("/getmore", {
                                minId: val
                            })
                            .then(function(resp) {
                                let newImages = resp.data.rows;
                                for (var i = 0; i < newImages.length; i++) {
                                    self.images.push(newImages[i]);
                                }
                                if (newImages.length < 6) {
                                    self.buttonVis = false;
                                }
                            });
                    })
                    .catch(function(e) {
                        console.log(e);
                    });
            },
            watch: {
                imageId: function() {
                    var self = this;
                    axios
                        .get("/get-image-info/" + this.imageId)
                        .then(function(resp) {
                            if (resp.data[0]) {
                                self.imageInfo = resp.data[0];
                            } else {
                                location.hash = "";
                            }
                        });

                    axios
                        .get("/get-comment-info/" + this.imageId)
                        .then(function(resp) {
                            self.comments = resp.data;
                        });
                }
            }
        }
    });
    // REGISTRATION PAGE-----------------------------------//
})();
