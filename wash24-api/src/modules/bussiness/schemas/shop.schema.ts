import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import * as mongoosePaginate from "mongoose-paginate-v2";
import { User } from "../../identity/schemas/user.schema";

@Schema({
	timestamps: true,
	toJSON: {
		virtuals: true,
		transform: function (doc, ret) {
			return ret;
		},
	},
})
export class Shop extends Document {
	@Prop({ type: String, required: true })
	name: string;

	@Prop({ type: String, required: true })
	address: string;

	@Prop({ type: String, required: true })
	phone: string;

	@Prop({ type: String, required: false })
	email: string;

	@Prop({ type: String, required: true })
	bakongId: string;

	@Prop({ type: String, required: false, default: null })
  logo: string | null;

	@Prop({
		type: Types.ObjectId,
		required: true,
		ref: User.name,
	})
	owner: Types.ObjectId;

	@Prop({ type: Boolean, default: true })
	enable: boolean;
}

export const ShopSchema = SchemaFactory.createForClass(Shop);
ShopSchema.plugin(mongoosePaginate);
