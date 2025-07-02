import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import * as mongoosePaginate from "mongoose-paginate-v2";
import { Push } from "./push.schema";

@Schema({
	timestamps: true,
	toJSON: {
		virtuals: true,
		transform: function (doc, ret) {
			return ret;
		},
	},
})
export class Program extends Document {
	@Prop({ type: String, required: true })
	name: string;

	@Prop({ type: Number, required: true })
	duration: number;

	@Prop({ type: [{ type: Types.ObjectId, ref: Push.name }] })
	pushs: Types.ObjectId[];
}

export const ProgramSchema = SchemaFactory.createForClass(Program);
ProgramSchema.plugin(mongoosePaginate);
