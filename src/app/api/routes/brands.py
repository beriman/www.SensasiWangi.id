"""Brand related API routes for co-owner management."""

from __future__ import annotations

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Request, status
from pydantic import BaseModel, Field
from starlette.responses import TemplateResponse

from ...services.brands import BrandService

router = APIRouter(prefix="/brands", tags=["brands"])


class InviteCoOwnerPayload(BaseModel):
    """Payload used when inviting a co-owner."""

    username: str = Field(..., description="Username akun yang diundang sebagai co-owner")
    note: str | None = Field(default=None, description="Catatan opsional yang dikirim bersama undangan")


async def get_brand_service(request: Request) -> BrandService:
    service = getattr(request.app.state, "brand_service", None)
    if service is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Brand service belum dikonfigurasi",
        )
    if not isinstance(service, BrandService):
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Brand service tidak valid",
        )
    return service


@router.post("/{slug}/co-owners", response_class=TemplateResponse, name="brands:invite_co_owner")
async def invite_co_owner(
    request: Request,
    slug: str,
    payload: InviteCoOwnerPayload,
    brand_service: BrandService = Depends(get_brand_service),
) -> TemplateResponse:
    """Invite a user to become a co-owner of the brand."""

    return await brand_service.invite_co_owner(
        request,
        slug,
        username=payload.username,
        note=payload.note,
    )


@router.post(
    "/{slug}/co-owners/{profile_id}/approve",
    response_class=TemplateResponse,
    name="brands:approve_co_owner",
)
async def approve_co_owner(
    request: Request,
    slug: str,
    profile_id: UUID,
    brand_service: BrandService = Depends(get_brand_service),
) -> TemplateResponse:
    """Approve a pending co-owner invitation."""

    return await brand_service.approve_co_owner(request, slug, profile_id)


@router.delete(
    "/{slug}/co-owners/{profile_id}",
    response_class=TemplateResponse,
    name="brands:cancel_co_owner_invite",
)
async def cancel_co_owner_invite(
    request: Request,
    slug: str,
    profile_id: UUID,
    brand_service: BrandService = Depends(get_brand_service),
) -> TemplateResponse:
    """Cancel a pending co-owner invitation."""

    return await brand_service.cancel_co_owner_invite(request, slug, profile_id)
