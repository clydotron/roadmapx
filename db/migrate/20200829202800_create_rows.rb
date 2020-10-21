class CreateRows < ActiveRecord::Migration[6.0]
  def change
    create_table :rows do |t|
      t.belongs_to :lane, null: false, foreign_key: true
      t.timestamps
    end
  end
end
