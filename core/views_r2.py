import os
import uuid
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework import status

from .r2 import r2_client

ALLOWED_FOLDERS = {"themes", "sets", "part-colors", "parts", "uploads"}
ALLOWED_CONTENT_PREFIXES = ("image/",)

@api_view(["POST"])
@permission_classes([IsAdminUser])
def r2_presign_upload(request):
    """
    Request body:
    {
      "folder": "part-colors",
      "filename": "my.png",
      "content_type": "image/png"
    }

    Response:
    {
      "upload_url": "...presigned PUT...",
      "public_url": "https://assets.example.com/part-colors/<uuid>.png",
      "key": "part-colors/<uuid>.png"
    }
    """
    folder = (request.data.get("folder") or "uploads").strip().strip("/")
    filename = (request.data.get("filename") or "file").strip()
    content_type = (request.data.get("content_type") or "application/octet-stream").strip()

    if folder not in ALLOWED_FOLDERS:
        return Response({"detail": "Invalid folder."}, status=status.HTTP_400_BAD_REQUEST)

    if not content_type.startswith(ALLOWED_CONTENT_PREFIXES):
        return Response({"detail": "Only image uploads are allowed."}, status=status.HTTP_400_BAD_REQUEST)

    ext = ""
    if "." in filename:
        ext = "." + filename.split(".")[-1].lower()

    key = f"{folder}/{uuid.uuid4().hex}{ext}"

    s3 = r2_client()
    bucket = os.environ["R2_BUCKET_NAME"]

    upload_url = s3.generate_presigned_url(
        ClientMethod="put_object",
        Params={
            "Bucket": bucket,
            "Key": key,
            "ContentType": content_type,
        },
        ExpiresIn=60 * 5,  # 5 minutes
    )

    public_base = os.environ["R2_PUBLIC_BASE_URL"].rstrip("/")
    public_url = f"{public_base}/{key}"

    return Response({"upload_url": upload_url, "public_url": public_url, "key": key})
