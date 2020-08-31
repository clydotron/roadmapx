class CreateRoadmaps < ActiveRecord::Migration[6.0]
  def change
    create_table :roadmaps do |t|
      t.string :title
      t.string :description
      t.belongs_to :workspace, null: false, foreign_key: true

      t.timestamps
    end
  end
end
