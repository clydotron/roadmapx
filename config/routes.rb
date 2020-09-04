Rails.application.routes.draw do
  root 'pages#index'

  get 'workspace', to: 'pages#workspace'
  get 'roadmapx', to: 'pages#roadmap'

  namespace :api do
    namespace :v1 do
      resources :lanes
      resources :tasks
      resources :roadmaps
      resources :workspaces
    end
  end

  get '*path', to: 'pages#index', via: :all
end
