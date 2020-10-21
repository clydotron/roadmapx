module Api
  module V1
    class RowsController < ApplicationController
      protect_from_forgery with: :null_session
       
      def index
        rows = Row.all
        render json: RowSerializer.new(rows,options).serialized_json
      end

      def show
        row = Row.find(params[:id])
        render json: RowSerializer.new(row,options).serialized_json
      end

      def create
        row = lane.rows.new(row_params)
       
        if row.save
          render json: RowSerializer.new(row).serialized_json
        else
          render json: {error: row.errors.messages }, status: 422
        end
      end

      def update
        row = Row.find(params[:id])
        if row.update(row_params)
          render json: RowSerializer.new(row).serialized_json
        else
          render json: {error: row.errors.messages}, status: 422
        end
      end
      
      def destroy
        row = Row.find(params[:id])

        if row.destroy
          head :no_content
        else
          render json: {error: row.errors.messages }, status: 422   
        end
      end

      private
      def lane
        @lane = Lane.find(params[:lane_id])
      end

      def row_params
        params.require(:row).permit(:lane_id)
      end

      def options
        @options ||= { include: %i[tasks]}
      end

    end
  end
end