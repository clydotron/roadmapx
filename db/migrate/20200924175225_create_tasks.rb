class CreateTasks < ActiveRecord::Migration[6.0]
  def change
    create_table :tasks do |t|
      t.string :title
      t.string :color
      t.integer :sort_key
      t.belongs_to :row, null: false, foreign_key: true
      t.timestamps
    end
  end
end
