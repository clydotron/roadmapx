class AddSortKeyToLanes < ActiveRecord::Migration[6.0]
  def change
    add_column :lanes, :sort_key, :integer
  end
end
