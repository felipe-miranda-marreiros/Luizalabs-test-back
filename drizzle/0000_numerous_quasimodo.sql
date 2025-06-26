CREATE TABLE "emails_table" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "emails_table_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"email" varchar(255) NOT NULL,
	CONSTRAINT "emails_table_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "users_table" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_table_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"email_id" integer NOT NULL,
	"password" varchar(255) NOT NULL,
	"first_name" varchar(255) NOT NULL,
	"last_name" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "wishes_table" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "wishes_table_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"user_id" integer NOT NULL,
	"product_ids" integer[] NOT NULL
);
