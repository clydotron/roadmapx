# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2020_09_01_171000) do

  create_table "lanes", force: :cascade do |t|
    t.string "title"
    t.string "description"
    t.boolean "collapsed"
    t.string "color"
    t.integer "roadmap_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "sort_key"
    t.index ["roadmap_id"], name: "index_lanes_on_roadmap_id"
  end

  create_table "roadmaps", force: :cascade do |t|
    t.string "title"
    t.string "description"
    t.integer "workspace_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["workspace_id"], name: "index_roadmaps_on_workspace_id"
  end

  create_table "tasks", force: :cascade do |t|
    t.string "title"
    t.string "color"
    t.integer "lane_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "sort_key"
    t.index ["lane_id"], name: "index_tasks_on_lane_id"
  end

  create_table "workspaces", force: :cascade do |t|
    t.string "title"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  add_foreign_key "lanes", "roadmaps"
  add_foreign_key "roadmaps", "workspaces"
  add_foreign_key "tasks", "lanes"
end
