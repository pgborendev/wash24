import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import * as mongoosePaginate from "mongoose-paginate-v2";

@Schema({
	timestamps: true,
	toJSON: {
		virtuals: true,
		transform: function (doc, ret) {
			return ret;
		},
	},
})
export class Push extends Document {
	@Prop({ type: String, required: true })
	name: string;

	@Prop({ type: Number, required: true })
	gpiopin: number;

	@Prop({ type: Number, required: true })
	pushs: number;
}

export const PushSchema = SchemaFactory.createForClass(Push);
PushSchema.plugin(mongoosePaginate);
