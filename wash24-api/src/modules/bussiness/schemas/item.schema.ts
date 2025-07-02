import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import * as mongoosePaginate from "mongoose-paginate-v2";
import { Program } from "./program.schema";
import { Device } from "./device.schema";

@Schema({
	timestamps: true,
	toJSON: {
		virtuals: true,
		transform: function (doc, ret) {
			return ret;
		},
	},
})
export class Item extends Document {
	@Prop({ type: String, required: true })
	name: string;

	@Prop({ type: String })
	description: string;

	@Prop([{ type: String, required: true }])
	categories: string[];

	@Prop({ type: { type: Types.ObjectId, ref: Device.name } })
	device: Types.ObjectId;

	@Prop({ type: { type: Types.ObjectId, ref: Program.name } })
	program: Types.ObjectId;

	@Prop({ type: Number, required: true })
	price: number;
}

export const ItemSchema = SchemaFactory.createForClass(Item);

ItemSchema.index({ name: "text" });

ItemSchema.plugin(mongoosePaginate);
