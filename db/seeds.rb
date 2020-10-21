# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

workspace = Workspace.create({title: "Candidate Homework X"})

roadmap = Roadmap.create({title:"RoadmapX", description:"test", workspace:workspace})

lanes = Lane.create([{title:"lane1", description:"words",color:"#456799",collapsed:false, roadmap:roadmap,sort_key:1},
                     {title:"lane2", description:"words",color:"#ff6799",collapsed:false, roadmap:roadmap, sort_key:2},
                     {title:"lane3", description:"words",color:"#45ff99",collapsed:true, roadmap:roadmap, sort_key:3}
])

rows = Row.create([{lane:lanes.first},
                      {lane:lanes.first},
                      {lane:lanes.last}
])

tasks = Task.create([{title:"Task 1",color:"#ff0000",row:rows.first},
                    {title:"Task 2",color:"#00ff00",row:rows.first},
                    {title:"Task 3",color:"#0000ff",row:rows.last}
])