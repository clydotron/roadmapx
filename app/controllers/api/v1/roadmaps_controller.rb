module Api
  module V1
    class RoadmapsController < ApplicationController
      protect_from_forgery with: :null_session
       
      def index
        roadmaps = Roadmap.all
        render json: RoadmapSerializer.new(roadmaps).serialized_json
      end

      def show
        roadmap = Roadmap.find(params[:id])
        render json: RoadmapSerializer.new(roadmap,options).serialized_json
      end

      def update
        roadmap = Roadmap.find(params[:id])
        if roadmap.update(roadmap_params)
          render json: RoadmapSerializer.new(roadmap,options).serialized_json
        else
          render json: {error: roadmap.errors.messages}, status: 422
        end
      end
      private

      def roadmap_params
        params.require(:roadmap).permit(:next_lane_id, :onboarding_state)
      end

      def options
        @options ||= { include: %i[lanes]}
      end

    end
  end
end