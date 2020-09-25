class CreateTaskRows < ActiveRecord::Migration[6.0]
  def change
    create_table :task_rows do |t|
      t.belongs_to :lane, null: false, foreign_key: true
      t.timestamps
    end

    create_table :tasks do |t|
      t.string :title
      t.string :color
      t.integer :sort_key
      t.belongs_to :task_row, null: false, foreign_key: true

      t.timestamps
    end
  end
end
