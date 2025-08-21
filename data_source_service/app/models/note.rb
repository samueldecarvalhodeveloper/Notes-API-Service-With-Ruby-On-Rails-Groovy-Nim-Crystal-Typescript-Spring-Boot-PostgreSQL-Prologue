class Note < ApplicationRecord
  belongs_to :user

  validates :id, presence: true
  validates :title, presence: true
  validates :body, presence: true
  validates :created_at, presence: true
  validates :updated_at, presence: true
  validates :user_id, presence: true

  def as_json(options = {})
    super(options).transform_keys { |key| key.camelize(:lower) }
  end
end
