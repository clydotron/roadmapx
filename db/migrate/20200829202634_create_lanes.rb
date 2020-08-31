class CreateLanes < ActiveRecord::Migration[6.0]
  def change
    create_table :lanes do |t|
      t.string :title
      t.string :description
      t.boolean :collapsed
      t.string :color
      t.belongs_to :roadmap, null: false, foreign_key: true

      t.timestamps
    end
  end
end
