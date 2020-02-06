const Campground = require("./models/campground");

const campgrounds = [
    {
        name: "Campground 1",
        image:
            "https://cdn.pixabay.com/photo/2014/11/27/18/36/tent-548022__340.jpg",
        description:
            "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Beatae veritatis quod fuga iusto laboriosam dolorem facilis eaque, quam molestiae nostrum!"
    },
    {
        name: "Campground 2",
        image:
            "https://cdn.pixabay.com/photo/2020/01/11/07/39/north-4756774__340.jpg",
        description:
            "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Beatae veritatis quod fuga iusto laboriosam dolorem facilis eaque, quam molestiae nostrum!"
    },
    {
        name: "Campground 3",
        image:
            "https://cdn.pixabay.com/photo/2016/02/18/22/16/tent-1208201__340.jpg",
        description:
            "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Beatae veritatis quod fuga iusto laboriosam dolorem facilis eaque, quam molestiae nostrum!"
    }
];

async function seedDB() {
    try {
        // remove all existing campgrounds
        await Campground.deleteMany({});
        console.log("Campgrounds removed");
        
        // add campgrounds
        for(const camp of campgrounds){
            await Campground.create(camp);
            console.log(`Campground "${camp.name}" created`);
        }

    } catch (err) {
        console.log(err);
    }
}

module.exports = seedDB;