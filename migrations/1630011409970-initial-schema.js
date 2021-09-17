const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class initialSchema1630011409970 {
    name = 'initialSchema1630011409970'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "admin" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "report" ("id" SERIAL NOT NULL, "price" integer NOT NULL, "manufacturer" character varying NOT NULL, "model" character varying NOT NULL, "year" integer NOT NULL, "lat" integer NOT NULL, "lon" integer NOT NULL, "mileage" integer NOT NULL, "approved" boolean NOT NULL DEFAULT false, "userId" integer, CONSTRAINT "PK_99e4d0bea58cba73c57f935a546" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "report" ADD CONSTRAINT "FK_e347c56b008c2057c9887e230aa" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "report" DROP CONSTRAINT "FK_e347c56b008c2057c9887e230aa"`);
        await queryRunner.query(`DROP TABLE "report"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }
}
