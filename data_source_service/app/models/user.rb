class User < ApplicationRecord
  has_many :notes, dependent: :destroy

  validates :id, presence: true
  validates :username, presence: true
end
