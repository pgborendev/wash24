// user.schema.ts
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
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
export class Profile extends Document {
	@Prop({
		type: String,
		required: true,
		trim: true,
		minlength: 1,
		maxlength: 50,
	})
	firstname: string;

	@Prop({
		type: String,
		required: true,
		trim: true,
		minlength: 1,
		maxlength: 50,
	})
	lastname: string;

	@Prop({
		type: String,
		enum: ["male", "female"],
		required: false,
	})
	gender: string;

	@Prop({
		type: Date,
		required: false,
	})
	dateofbirth: Date;

	@Prop({
		type: String,
		required: true,
		validate: {
			validator: (v: string) => mongoose.Types.ObjectId.isValid(v),
			message: "Invalid user ID",
		},
	})
	user: string;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);

ProfileSchema.plugin(mongoosePaginate);
