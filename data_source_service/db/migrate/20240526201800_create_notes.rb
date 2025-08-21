class CreateNotes < ActiveRecord::Migration[7.1]
  def change
    create_table :notes, id: false do |t|
      t.integer :id, null: false, primary_key: true
      t.string :title, null: false
      t.string :body, null: false
      t.integer :created_at, null: false
      t.integer :updated_at, null: false
      t.references :user, null: false, foreign_key: true
    end
  end
end
