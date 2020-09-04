class AddIndexToTasks < ActiveRecord::Migration[6.0]
  def change
    add_column :tasks, :sort_key, :integer
  end
end
