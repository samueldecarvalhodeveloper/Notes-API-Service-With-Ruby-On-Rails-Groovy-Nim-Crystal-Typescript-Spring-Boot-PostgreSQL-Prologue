class CreateUsers < ActiveRecord::Migration[7.1]
  def change
    create_table :users, id: false do |t|
      t.integer :id, null: false, primary_key: true
      t.string :username, null: false
    end
  end
end
